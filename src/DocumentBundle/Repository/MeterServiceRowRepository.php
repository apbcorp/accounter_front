<?php

namespace DocumentBundle\Repository;

use CoreBundle\Dictionary\ServiceTypeDictionary;
use Doctrine\ORM\EntityRepository;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\Meter;
use KontragentBundle\Entity\Service;

class MeterServiceRowRepository extends EntityRepository
{
    /**
     * @param Meter $meter
     * @param \DateTime $date
     * @return int
     */
    public function getEndValueByDate(Meter $meter, \DateTime $date)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('q.endData')
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
            ->orderBy('q.endData', 'desc')
            ->setMaxResults(1);

        $result = $qb->getQuery()->getResult();

        return isset($result[0]) ? $result[0]['endData'] : 0;
    }

    /**
     * @param \DateTime $date
     * @param Ground    $ground
     * @param Service   $service
     * @return float
     */
    public function getDebt(\DateTime $date, Ground $ground, Service $service)
    {
        $meters = $this->getEntityManager()->getRepository(Meter::class)->findBy(['deleted' => false, 'ground' => $ground]);
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('SUM(q.sum) as summa')
            ->from($this->getEntityName(), 'q')
            ->where(
                $qb->expr()->andX(
                    $qb->expr()->eq('q.deleted', ':false'),
                    $qb->expr()->eq('q.service', ':service'),
                    $qb->expr()->in('q.meters', ':meters'),
                    $qb->expr()->lte('d.date', ':date')
                )
            )
            ->setParameter('false', false)
            ->setParameter('service', $service)
            ->setParameter('meters', $meters)
            ->setParameter('date', $date);

        $result = $qb->getQuery()->getResult();

        return isset($result[0]) ? $result[0]['summa'] : 0;
    }
}