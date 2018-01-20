<?php

namespace DocumentBundle\Repository;

use CoreBundle\BaseClasses\ListRepositoryAbstract;
use Doctrine\ORM\Query\Expr\Join;
use DocumentBundle\Entity\ServiceDocument;
use DocumentBundle\Entity\ServiceRow;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\GroundParts;
use KontragentBundle\Entity\Kontragent;
use KontragentBundle\Entity\Service;

class ServiceDocumentRepository extends ListRepositoryAbstract
{
    protected $dateField = 'date';

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
            $qb->join(Kontragent::class, 'k', Join::WITH, 'q.kontragent = k.id')
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
            ->join(ServiceRow::class, 'p', Join::WITH, 'p.document = q.id')
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

    public function getReport(\DateTime $dateStart, \DateTime $dateEnd, $unitId)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('q.id, q.kontragentId, q.accNumber, q.area, q.freeArea, q.commonArea, q.allArea, k.name, k.surname, k.name2')
            ->from(Ground::class, 'q')
            ->join(Kontragent::class, 'k', Join::WITH, 'q.kontragentId = k.id')
            ->where(
                $qb->expr()->andX(
                    $qb->expr()->eq('q.deleted', ':false'),
                    $qb->expr()->eq('q.unitId', ':unitId')
                )
            )
            ->setParameter('false', false)
            ->setParameter('unitId', $unitId);

        $grounds = $qb->getQuery()->getResult();

        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('q.groundId, q.number, q.line, q.groundNumber')
            ->from(GroundParts::class, 'q')
            ->where($qb->expr()->eq('q.deleted', ':false'))
            ->setParameter('false', false);

        $groundParts = $qb->getQuery()->getResult();

        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('q.groundId, q.serviceId, SUM(q.sum) as summa, d.kontragentId')
            ->from(ServiceRow::class, 'q')
            ->join(ServiceDocument::class, 'd', Join::WITH, 'q.documentId = d.id')
            ->where(
                $qb->expr()->andX(
                    $qb->expr()->eq('q.deleted', ':false'),
                    $qb->expr()->gte('q.date', ':dateStart'),
                    $qb->expr()->lte('q.date', ':dateEnd')
                )
            )
            ->groupBy('q.groundId, q.serviceId')
            ->setParameter('false', false)
            ->setParameter('dateStart', $dateStart)
            ->setParameter('dateEnd', $dateEnd);

        $services = $qb->getQuery()->getResult();

        $serviceNames = [];
        $result = [];

        foreach ($grounds as $ground) {
            $record = [
                'kontragent' => implode(' ', [$ground['surname'], $ground['name'], $ground['name2']]),
                'account' => $ground['accNumber'],
                'house' => [],
                'area' => $ground['area'],
                'freeArea' => $ground['freeArea'],
                'commonArea' => $ground['commonArea'],
                'allArea' => $ground['allArea'],
                'services' => []
            ];

            foreach ($groundParts as $part) {
                if ($part['groundId'] == $ground['id']) {
                    $record['house'][] = ['number' => $part['number'], 'line' => $part['line'], 'groundNumber' => $part['groundNumber']];
                }
            }

            foreach ($services as $key => $service) {
                if ($service['groundId'] == $ground['id'] || (!$service['groundId'] && $service['kontragentId'] == $ground['kontragentId'])) {
                    if (!isset($serviceNames[$service['serviceId']])) {
                        /** @var Service $serviceEntity */
                        $serviceEntity = $this->getEntityManager()->getRepository(Service::class)->find($service['serviceId']);
                        $serviceNames[$service['serviceId']] = $serviceEntity->getName();
                    }

                    $record['services'][] = ['name' => $serviceNames[$service['serviceId']], 'sum' => $service['summa'], 'id' => $service['serviceId']];

                    if (!$service['groundId']) {
                        $services[$key]['summa'] = 0;
                    }
                }
            }

            $result[] = $record;
        }

        return [
            'result' => $result,
            'services' => $serviceNames,
            'additionalInfo' => [
                'dateStart' => $dateStart,
                'dateEnd' => $dateEnd
            ]
        ];
    }
}