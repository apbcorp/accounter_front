<?php

namespace DocumentBundle\Repository;

use CoreBundle\Dictionary\ServiceTypeDictionary;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Query\Expr\Join;
use DocumentBundle\Entity\ServiceDocument;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\Service;

class ServiceRowRepository extends EntityRepository
{
    /**
     * @param Service   $service
     * @param Ground    $ground
     * @param \DateTime $dateStart
     * @param \DateTime $dateEnd
     * @return float
     */
    public function getCountByPeriod(Service $service, Ground $ground, \DateTime $dateStart, \DateTime $dateEnd)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();

        $qb->select('SUM(q.count) as summma')
            ->from($this->getEntityName(), 'q')
            ->where(
                $qb->expr()->andX(
                    $qb->expr()->eq('q.deleted', ':false'),
                    $qb->expr()->eq('q.service', ':service'),
                    $qb->expr()->between('q.date', ':dateStart', ':dateEnd')
                )
            )
            ->setParameter('false', false)
            ->setParameter('service', $service)
            ->setParameter('dateStart', $dateStart)
            ->setParameter('dateEnd', $dateEnd);

        if ($service->getType() == ServiceTypeDictionary::KONTRAGENT_TYPE) {
            $qb->join(ServiceDocument::class, 'd', Join::WITH, 'd.id = q.document')
                ->setParameter('kontragent', $ground->getKontragent())
                ->andWhere($qb->expr()->eq('d.kontragent', ':kontragent'));
        } else {
            $qb->setParameter('ground', $ground)
                ->andWhere($qb->expr()->eq('q.ground', ':ground'));
        }

        $result = $qb->getQuery()->getResult();

        return isset($result[0]) ? $result[0]['summma'] : 0;
    }

    /**
     * @param \DateTime $date
     * @param Ground    $ground
     * @param Service   $service
     * @return float
     */
    public function getDebt(\DateTime $date, Ground $ground, Service $service)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('SUM(q.sum) as summa')
            ->from($this->getEntityName(), 'q')
            ->where(
                $qb->expr()->andX(
                    $qb->expr()->eq('q.deleted', ':false'),
                    $qb->expr()->eq('q.service', ':service'),
                    $qb->expr()->lte('d.date', ':date')
                )
            )
            ->setParameter('false', false)
            ->setParameter('service', $service)
            ->setParameter('date', $date);

        if ($service->getType() == ServiceTypeDictionary::KONTRAGENT_TYPE) {
            $qb->join(ServiceDocument::class, 'd', Join::WITH, 'd.id = q.document')
                ->setParameter('kontragent', $ground->getKontragent())
                ->andWhere($qb->expr()->eq('d.kontragent', ':kontragent'));
        } else {
            $qb->setParameter('ground', $ground)
                ->andWhere($qb->expr()->eq('q.ground', ':ground'));
        }

        $result = $qb->getQuery()->getResult();

        return isset($result[0]) ? $result[0]['summa'] : 0;
    }
}