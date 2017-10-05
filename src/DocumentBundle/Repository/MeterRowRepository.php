<?php

namespace DocumentBundle\Repository;

use Doctrine\ORM\EntityRepository;
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
}