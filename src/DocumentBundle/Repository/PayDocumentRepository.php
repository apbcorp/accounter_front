<?php

namespace DocumentBundle\Repository;

use CoreBundle\BaseClasses\ListRepositoryAbstract;
use Doctrine\ORM\Query\Expr\Join;
use DocumentBundle\Entity\PayRow;
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
}