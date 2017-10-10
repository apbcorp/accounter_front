<?php

namespace DocumentBundle\Repository;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Query\Expr\Join;
use DocumentBundle\Entity\AccurringDocument;
use KontragentBundle\Entity\Kontragent;
use KontragentBundle\Entity\Service;

class AccurringRowRepository extends EntityRepository
{
    /**
     * @param Service    $service
     * @param Kontragent $kontragent
     * @param \DateTime  $date
     * @return int
     */
    public function getValueForPeriod(Service $service, Kontragent $kontragent, \DateTime $date)
    {
        $dateStart = $date->modify('first day');
        $dateEnd = $date->modify('last day');

        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('sum(q.calcBase) as baseSum')
            ->from($this->getEntityName(), 'q')
            ->join(AccurringDocument::class, 'd', Join::WITH, 'q.document = d.id')
            ->where(
                $qb->expr()->andX(
                    $qb->expr()->eq('q.deleted', ':false'),
                    $qb->expr()->eq('q.service', ':service'),
                    $qb->expr()->eq('d.kontragent', ':kontragent'),
                    $qb->expr()->gte('d.date', ':dateStart'),
                    $qb->expr()->lte('d.date', ':dateEnd')
                )
            )
            ->setParameter('service', $service)
            ->setParameter('kontragent', $kontragent)
            ->setParameter('false', false)
            ->setParameter('dateStart', $dateStart)
            ->setParameter('dateEnd', $dateEnd);

        $result = $qb->getQuery()->getResult();

        return $result[0]['baseSum'];
    }
}