<?php

namespace DocumentBundle\Repository;

use CoreBundle\Dictionary\ServiceTypeDictionary;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Query\Expr\Join;
use DocumentBundle\Entity\PayDocument;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\Service;

class PayRowRepository extends EntityRepository
{
    /**
     * @param \DateTime $date
     * @param Ground $ground
     * @param Service $service
     * @return float
     */
    public function getPays(\DateTime $date, Ground $ground, Service $service)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('SUM(q.sum) as summa')
            ->from($this->getEntityName(), 'q')
            ->join(PayDocument::class, 'd', Join::WITH, 'd.id = q.document')
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
            $qb->setParameter('kontragent', $ground->getKontragent())
                ->andWhere($qb->expr()->eq('d.kontragent', ':kontragent'));
        } else {
            $qb->setParameter('ground', $ground)
                ->andWhere($qb->expr()->eq('q.ground', ':ground'));
        }

        $result = $qb->getQuery()->getResult();

        return isset($result[0]) ? $result[0]['summa'] : 0;
    }
}