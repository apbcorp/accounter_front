<?php

namespace DocumentBundle\Repository;

use CoreBundle\BaseClasses\ListRepositoryAbstract;
use CoreBundle\Dictionary\MetricTypeDictionary;
use Doctrine\ORM\Query\Expr\Join;
use DocumentBundle\Entity\MeterDocument;
use DocumentBundle\Entity\MeterRow;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\Kontragent;
use KontragentBundle\Entity\Meter;
use KontragentBundle\Helper\KontragentHelper;

class MeterDocumentRepository extends ListRepositoryAbstract
{
    protected $dateField = 'date';
    
    /**
     * @param string    $searchString
     * @param \DateTime $date
     * @param int       $unitId
     * @return array
     */
    public function search($searchString, \DateTime $date, $unitId)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('q.id, q.number, k.surname, k.name, k.name2')
            ->from(Meter::class, 'q')
            ->where(
                $qb->expr()->andX(
                    $qb->expr()->orX(
                        $qb->expr()->like('q.id', ':search'),
                        $qb->expr()->like('q.number', ':search'),
                        $qb->expr()->like('k.surname', ':search'),
                        $qb->expr()->like('k.name', ':search'),
                        $qb->expr()->like('k.name2', ':search')
                    ),
                    $qb->expr()->eq('q.deleted', ':false'),
                    $qb->expr()->eq('q.unitId', ':unitId')
                )
            )
            ->setParameter('search', '%' . $searchString . '%')
            ->setParameter('false', false)
            ->setParameter('unitId', $unitId)
            ->join(Ground::class, 'g', Join::WITH,'q.ground = g.id')
            ->join(Kontragent::class, 'k', Join::WITH, 'k.id = g.kontragent');

        $queryResult = $qb->getQuery()->getResult();

        $result = [];
        foreach ($queryResult as $row) {
            $qb = $this->getEntityManager()->createQueryBuilder();
            $qb->select('q.endValue')
                ->from(MeterRow::class, 'q')
                ->join(MeterDocument::class, 'd', Join::WITH, 'q.document = d.id')
                ->where(
                    $qb->expr()->andX(
                        $qb->expr()->eq('q.meter', ':id'),
                        $qb->expr()->lt('d.date', ':date')
                    )
                )
                ->setParameter('id', $row['id'])
                ->setParameter('date', $date)
                ->orderBy('d.date', 'desc')
                ->setMaxResults(1);

            $res = $qb->getQuery()->getResult();

            $result[] = [
                'id' => $row['id'],
                'name' => '№ ' . $row['number'] . ' собственник ' . implode(' ', [$row['surname'], $row['name'], $row['name2']]),
                'additionalParams' => [
                    'lastMeterValue' => isset($res[0]) ? $res[0]['endValue'] : 0
                ]
            ];
        }

        return $result;
    }

    /**
     * @param \DateTime $dateStart
     * @param \DateTime $dateEnd
     * @param int       $unitId
     * @return array
     */
    public function getReport(\DateTime $dateStart, \DateTime $dateEnd, $unitId)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();

        //meters list
        $qb->select('m.id, m.number as meterName, m.type, g.accNumber, k.name, k.surname, k.name2')
            ->from(Meter::class, 'm')
            ->join(Ground::class, 'g', Join::WITH, 'g.id = m.ground')
            ->join(Kontragent::class, 'k', Join::WITH, 'k.id = g.kontragent')
            ->where(
                $qb->expr()->andX(
                    $qb->expr()->eq('m.deleted', ':false'),
                    $qb->expr()->eq('m.unitId', ':unitId')
                )
            )
            ->setParameter('false', false)
            ->setParameter('unitId', $unitId);

        $meters = $qb->getQuery()->getArrayResult();

        $result = [];
        foreach ($meters as $meter) {
            $qb = $this->getEntityManager()->createQueryBuilder();

            $qb->select('r.endValue')
                ->from(MeterRow::class, 'r')
                ->join(MeterDocument::class, 'd', Join::WITH, 'd.id = r.document')
                ->where(
                    $qb->expr()->andX(
                        $qb->expr()->eq('r.meter', ':meter'),
                        $qb->expr()->lt('d.date', ':date'),
                        $qb->expr()->eq('d.deleted', ':false')
                    )
                )
                ->setParameter('date', $dateStart)
                ->setParameter('false', false)
                ->setParameter('meter', $this->getEntityManager()->getReference(Meter::class, $meter['id']))
                ->setMaxResults(1)
                ->orderBy('d.date', 'DESC');

            $queryResult = $qb->getQuery()->getResult();

            $qb->setParameter('date', $dateEnd);
            $query2Result = $qb->getQuery()->getResult();

            $result[] = [
                'kontragent' => implode(' ', [$meter['surname'], $meter['name'], $meter['name2']]),
                'ground' => $meter['accNumber'],
                'meter' => $meter['meterName'],
                'type' => MetricTypeDictionary::LANGS[$meter['type']],
                'dataStart' => isset($queryResult[0]) ? $queryResult[0]['endValue'] : 0,
                'dataEnd' => isset($query2Result[0]) ? $query2Result[0]['endValue'] : 0
            ];
        }

        return $result;
    }
}