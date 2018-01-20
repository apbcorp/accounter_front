<?php

namespace DocumentBundle\Repository;

use CoreBundle\BaseClasses\ListRepositoryAbstract;
use Doctrine\ORM\Query\Expr\Join;
use DocumentBundle\Entity\MeterServiceDocument;
use DocumentBundle\Entity\MeterServiceRow;
use DocumentBundle\Entity\PayDocument;
use DocumentBundle\Entity\PayRow;
use DocumentBundle\Entity\ServiceDocument;
use DocumentBundle\Entity\ServiceRow;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\Kontragent;
use KontragentBundle\Entity\Service;

class PayDocumentRepository extends ListRepositoryAbstract
{
    protected $dateField = 'date';

    /**
     * @param \DateTime   $date
     * @param Kontragent  $kontragent
     * @param Ground|null $ground
     * @param Service     $service
     * @return float
     */
    public function getDebt(\DateTime $date, Kontragent $kontragent, $ground, Service $service)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();

        $qb->select('SUM(p.sum) as summa')
            ->from($this->getEntityName(), 'q')
            ->join(PayRow::class, 'p', Join::WITH, 'p.document = q.id')
            ->where(
                $qb->expr()->andX(
                    $qb->expr()->lte('q.date', ':date'),
                    $qb->expr()->eq('q.kontragent', ':kontragent'),
                    $qb->expr()->eq('q.deleted', ':false'),
                    $qb->expr()->eq('p.service', ':service')
                )
            )
            ->setParameter('date', $date)
            ->setParameter('false', false)
            ->setParameter('kontragent', $kontragent)
            ->setParameter('service', $service);

        if ($ground) {
            $qb->andWhere($qb->expr()->eq('p.ground', ':ground'))
                ->setParameter('ground', $ground);
        } else {
            $qb->andWhere($qb->expr()->isNull('p.ground'));
        }

        $result = $qb->getQuery()->getResult();

        return $result[0]['summa'];
    }

    /**
     * @param array $filters
     * @param array $order
     * @param int   $limit
     * @param int   $offset
     * @param int   $unitId
     * @return array
     */
    public function getList(array $filters, array $order, $limit, $offset, $unitId)
    {
        if (method_exists($this->getEntityName(), 'getUnitId')) {
            $filters['unitId'] = $unitId;
        }

        $isFilterByKontragent = isset($filters['kontragent']);
        if ($isFilterByKontragent) {
            $kontragent = urldecode($filters['kontragent']);
            unset($filters['kontragent']);
        }

        $qb = $this->getQuery($filters);
        $qb->orderBy('q.' . array_keys($order)[0], reset($order))
            ->setFirstResult($offset)
            ->setMaxResults($limit);

        if ($isFilterByKontragent) {
            $qb->join(Kontragent::class, 'k', Join::WITH, 'k.id = q.kontragent')
                ->andWhere(
                    $qb->expr()->orX(
                        $qb->expr()->like('k.name', ':kontragentPart'),
                        $qb->expr()->like('k.surname', ':kontragentPart'),
                        $qb->expr()->like('k.name2', ':kontragentPart')
                    )
                )
                ->setParameter('kontragentPart', '%' . $kontragent . '%');
        }

        $result = $qb->getQuery()->getResult();

        $qb = $this->getQuery($filters);
        $qb->select('count(q.id) as recordCount');
        $queryResult = $qb->getQuery()->getResult();

        return [
            'result' => $result,
            'page' => ($offset / $limit) + 1,
            'pageCount' => ceil($queryResult[0]['recordCount'] / $limit),
            'count' => count($result)
        ];
    }

    public function getReport(\DateTime $dateStart, \DateTime $dateEnd, $unitId)
    {
        $qb = $this->getPaysQuery($unitId);
        $qb->andWhere($qb->expr()->lt('d.date', ':dateStart'))
            ->setParameter('dateStart', $dateStart);

        $lastPays = $qb->getQuery()->getResult();

        $qb = $this->getServiceQuery($unitId);
        $qb->andWhere($qb->expr()->lt('d.date', ':dateStart'))
            ->setParameter('dateStart', $dateStart);

        $lastServices = $qb->getQuery()->getResult();

        $qb = $this->getMeterServiceQuery($unitId);
        $qb->andWhere($qb->expr()->lt('d.date', ':dateStart'))
            ->setParameter('dateStart', $dateStart);

        $lastServices = array_merge($lastServices, $qb->getQuery()->getResult());

        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('q.id, q.name, q.name2, q.surname, g.id as groundId, g.accNumber')
            ->from(Ground::class, 'g')
            ->join(Kontragent::class, 'q', Join::WITH, 'q.id = g.kontragentId')
            ->where($qb->expr()->eq('g.unitId', ':unitId'))
            ->andWhere($qb->expr()->eq('g.deleted', ':false'))
            ->setParameter('unitId', $unitId)
            ->setParameter('false', false);

        $grounds = $qb->getQuery()->getResult();

        $qb = $this->getPaysQuery($unitId);
        $qb->andWhere($qb->expr()->lte('d.date', ':dateEnd'))
            ->andWhere($qb->expr()->gte('d.date', ':dateStart'))
            ->setParameter('dateEnd', $dateEnd)
            ->setParameter('dateStart', $dateStart);

        $pays = $qb->getQuery()->getResult();

        $qb = $this->getServiceQuery($unitId);
        $qb->andWhere($qb->expr()->lte('d.date', ':dateEnd'))
            ->andWhere($qb->expr()->gte('d.date', ':dateStart'))
            ->setParameter('dateEnd', $dateEnd)
            ->setParameter('dateStart', $dateStart);

        $services = $qb->getQuery()->getResult();

        $qb = $this->getMeterServiceQuery($unitId);
        $qb->andWhere($qb->expr()->lte('d.date', ':dateEnd'))
            ->andWhere($qb->expr()->gte('d.date', ':dateStart'))
            ->setParameter('dateEnd', $dateEnd)
            ->setParameter('dateStart', $dateStart);

        $services = array_merge($services, $qb->getQuery()->getResult());

        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('q.id, q.name')
            ->from(Service::class, 'q')
            ->where($qb->expr()->eq('q.deleted', ':false'))
            ->setParameter('false', false);

        $serviceTmpList = $qb->getQuery()->getResult();

        $serviceList = [];
        foreach ($serviceTmpList as $service) {
            $serviceList[$service['id']] = $service['name'];
        }

        $result = [];
        $list = [];
        foreach ($grounds as $ground) {
            $kontragent = implode(' ', [$ground['surname'], $ground['name'], $ground['name2']]);
            $groundNumber = $ground['accNumber'];

            if (!isset($result[$kontragent])) {
                $result[$kontragent] = ['' => []];
                $this->setDefault($result[$kontragent][''], $serviceList);
                $list[$kontragent] = ['value' => $ground['id'], 'grounds' => ['' => null]];
            }

            if (!isset($result[$kontragent][$groundNumber])) {
                $this->setDefault($result[$kontragent][$groundNumber], $serviceList);
                $list[$kontragent]['grounds'][$groundNumber] = $ground['groundId'];
            }
        }

        foreach ($result as $kontragent => $data) {
            foreach ($data as $ground => $item) {
                $this->fill(
                    $result[$kontragent][$ground],
                    $lastServices,
                    $serviceList,
                    $list[$kontragent]['value'],
                    $list[$kontragent]['grounds'][$ground],
                    0
                );

                $this->fill(
                    $result[$kontragent][$ground],
                    $lastPays,
                    $serviceList,
                    $list[$kontragent]['value'],
                    $list[$kontragent]['grounds'][$ground],
                    1
                );

                $this->fill(
                    $result[$kontragent][$ground],
                    $services,
                    $serviceList,
                    $list[$kontragent]['value'],
                    $list[$kontragent]['grounds'][$ground],
                    2
                );

                $this->fill(
                    $result[$kontragent][$ground],
                    $pays,
                    $serviceList,
                    $list[$kontragent]['value'],
                    $list[$kontragent]['grounds'][$ground],
                    3
                );
            }
        }

        return [
            'result' => $result,
            'additionalInfo' => [
                'dateStart' => $dateStart,
                'dateEnd' => $dateEnd
            ]
        ];
    }

    private function fill(&$row, &$array, &$serviceList, $kontragentId, $groundId, $type)
    {
        foreach ($array as $item) {
            if (!isset($serviceList[$item['serviceId']])) {
                continue;
            }

            if ($item['kontragentId'] != $kontragentId || $item['groundId'] != $groundId) {
                continue;
            }

            $serviceName = $serviceList[$item['serviceId']];
            switch ($type) {
                case 0:
                    $this->addData($row[$serviceName], $item['summa'], 0, 0);

                    break;
                case 1:
                    $this->addData($row[$serviceName], $item['summa'] * -1, 0, 0);

                    break;
                case 2:
                    $this->addData($row[$serviceName], 0, $item['summa'], 0);

                    break;
                case 3:
                    $this->addData($row[$serviceName], 0, 0, $item['summa']);

                    break;
            }
        }
    }

    private function setDefault(&$row, &$serviceList)
    {
        foreach ($serviceList as $service) {
            $row[$service] = [
                'startData' => 0,
                'out' => 0,
                'in' => 0,
                'endData' => 0
            ];
        }
    }

    private function addData(&$row, $startData, $out, $in)
    {
        $row['startData'] += $startData;
        $row['out'] += $out;
        $row['in'] += $in;
        $row['endData'] = $row['startData'] + $row['out'] - $row['in'];
    }

    private function getPaysQuery($unitId)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('q.serviceId, sum(q.sum) as summa, q.groundId, d.kontragentId')
            ->from(PayDocument::class, 'd')
            ->join(PayRow::class, 'q', Join::WITH, 'd.id = q.documentId')
            ->join(Kontragent::class, 'k', Join::WITH, 'd.kontragentId = k.id')
            ->where(
                $qb->expr()->andX(
                    $qb->expr()->eq('d.deleted', ':false'),
                    $qb->expr()->eq('k.unitId', ':unitId')
                )
            )
            ->groupBy('d.kontragentId, q.groundId, q.serviceId')
            ->setParameter('false', false)
            ->setParameter('unitId', $unitId);

        return $qb;
    }

    private function getServiceQuery($unitId)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('q.groundId, q.serviceId, SUM(q.sum) as summa, d.kontragentId')
            ->from(ServiceDocument::class, 'd')
            ->join(ServiceRow::class, 'q', Join::WITH, 'd.id = q.documentId')
            ->where(
                $qb->expr()->andX(
                    $qb->expr()->eq('d.deleted', ':false'),
                    $qb->expr()->eq('d.unitId', ':unitId')
                )
            )
            ->groupBy('d.kontragentId, q.groundId, q.serviceId')
            ->setParameter('false', false)
            ->setParameter('unitId', $unitId);

        return $qb;
    }

    private function getMeterServiceQuery($unitId)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('d.groundId, q.serviceId, SUM(q.sum) as summa, g.kontragentId')
            ->from(MeterServiceDocument::class, 'd')
            ->join(MeterServiceRow::class, 'q', Join::WITH, 'd.id = q.documentId')
            ->join(Ground::class, 'g', Join::WITH, 'g.id = d.groundId')
            ->where(
                $qb->expr()->andX(
                    $qb->expr()->eq('d.deleted', ':false'),
                    $qb->expr()->eq('d.unitId', ':unitId')
                )
            )
            ->groupBy('g.kontragentId, d.groundId, q.serviceId')
            ->setParameter('false', false)
            ->setParameter('unitId', $unitId);

        return $qb;
    }
}