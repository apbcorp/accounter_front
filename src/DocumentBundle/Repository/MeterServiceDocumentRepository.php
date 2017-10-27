<?php

namespace DocumentBundle\Repository;

use CoreBundle\BaseClasses\ListRepositoryAbstract;
use Doctrine\ORM\Query\Expr\Join;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\Kontragent;

class MeterServiceDocumentRepository extends ListRepositoryAbstract
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

        $isFilterByKontragent = isset($filters['ground']);
        if ($isFilterByKontragent) {
            $kontragent = urldecode($filters['ground']);
            unset($filters['ground']);
        }

        $qb = $this->getQuery($filters);
        $qb->orderBy('q.' . array_keys($order)[0], reset($order))
            ->setFirstResult($offset)
            ->setMaxResults($limit);

        if ($isFilterByKontragent) {
            $qb->join(Ground::class, 'g', Join::WITH, 'q.ground = g.id')
                ->join(Kontragent::class, 'k', Join::WITH, 'k.id = g.kontragent')
                ->andWhere(
                    $qb->expr()->orX(
                        $qb->expr()->like('k.name', ':kontragentPart'),
                        $qb->expr()->like('k.surname', ':kontragentPart'),
                        $qb->expr()->like('k.name2', ':kontragentPart'),
                        $qb->expr()->like('g.accNumber', ':kontragentPart')
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