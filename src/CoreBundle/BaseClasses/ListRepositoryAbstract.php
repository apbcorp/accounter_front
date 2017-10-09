<?php

namespace CoreBundle\BaseClasses;

use Doctrine\ORM\EntityRepository;

abstract class ListRepositoryAbstract extends EntityRepository
{
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

        $result = $this->findBy($filters, $order, $limit, $offset);

        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('count(q.id) as recordCount')
            ->from($this->getEntityName(), 'q');

        foreach ($filters as $field => $value) {
            $qb->andWhere($qb->expr()->eq('q.' . $field, $value));
        }

        $qb->setMaxResults($limit);

        $queryResult = $qb->getQuery()->getResult();

        return [
            'result' => $result,
            'page' => ($offset / $limit) + 1,
            'pageCount' => ceil($queryResult[0]['recordCount'] / $limit),
            'count' => count($result)
        ];
    }
}