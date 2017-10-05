<?php

namespace DocumentBundle\Repository;

use Doctrine\ORM\EntityRepository;
use KontragentBundle\Entity\Service;

class TarifRowRepository extends EntityRepository
{
    /**
     * @param Service $service
     * @param \DateTime $date
     * @return float
     */
    public function getPrice(Service $service, \DateTime $date)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('q.price')
            ->from($this->getEntityName(), 'q')
            ->where(
                $qb->expr()->andX(
                    $qb->expr()->eq('q.deleted', ':false'),
                    $qb->expr()->eq('q.service', ':service'),
                    $qb->expr()->lte('q.created', ':date')
                )
            )
            ->setParameter('false', false)
            ->setParameter('service', $service)
            ->setParameter('date', $date)
            ->orderBy('q.created', 'desc')
            ->setMaxResults(1);

        $result = $qb->getQuery()->getResult();

        return isset($result[0]) ? $result[0]['price'] : 0;
    }
}