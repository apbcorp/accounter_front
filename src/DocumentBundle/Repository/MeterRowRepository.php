<?php

namespace DocumentBundle\Repository;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Query\Expr\Join;
use DocumentBundle\Entity\MeterDocument;
use KontragentBundle\Entity\Meter;

class MeterRowRepository extends EntityRepository
{
    /**
     * @param Meter     $meter
     * @param \DateTime $date
     * @return float
     */
    public function getEndValueByDate(Meter $meter, \DateTime $date)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('q.endValue')
            ->from($this->getEntityName(), 'q')
            ->where(
                $qb->expr()->andX(
                    $qb->expr()->eq('q.deleted', ':false'),
                    $qb->expr()->eq('q.meter', ':meter'),
                    $qb->expr()->lte('q.created', ':date')
                )
            )
            ->setParameter('false', false)
            ->setParameter('meter', $meter)
            ->setParameter('date', $date)
            ->orderBy('q.created', 'desc')
            ->setMaxResults(1);

        $result = $qb->getQuery()->getResult();

        return isset($result[0]) ? $result[0]['endValue'] : 0;
    }

    /**
     * @param Meter     $meter
     * @param \DateTime $dateStart
     * @param \DateTime $dateEnd
     * return float
     */
    public function getValueByDate(Meter $meter, \DateTime $dateStart, \DateTime $dateEnd)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('min(q.startValue) as min, max(q.endValue) as max')
            ->from($this->getEntityName(), 'q')
            ->join(MeterDocument::class, 'd', Join::WITH, 'd.id = q.document')
            ->where(
                $qb->expr()->andX(
                    $qb->expr()->eq('q.deleted', ':false'),
                    $qb->expr()->eq('q.meter', ':meter'),
                    $qb->expr()->lte('d.date', ':dateEnd'),
                    $qb->expr()->gte('d.date', ':dateStart')
                )
            )
            ->setParameter('false', false)
            ->setParameter('meter', $meter)
            ->setParameter('dateStart', $dateStart)
            ->setParameter('dateEnd', $dateEnd);

        $result = $qb->getQuery()->getResult();

        return $result['max'] - $result['min'];
    }
}