<?php

namespace KontragentBundle\Repository;

use CoreBundle\BaseClasses\Interfaces\SupplyRepositoryInterface;
use CoreBundle\BaseClasses\ListRepositoryAbstract;

class MeterRepository extends ListRepositoryAbstract implements SupplyRepositoryInterface
{
    /**
     * @param string $searchString
     * @param int    $unitId
     * @return array
     */
    public function search($searchString, $unitId)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('q.id, q.number')
            ->from($this->getEntityName(), 'q')
            ->where(
                $qb->expr()->andX(
                    $qb->expr()->orX(
                        $qb->expr()->like('q.id', ':search'),
                        $qb->expr()->like('q.number', ':search')
                    ),
                    $qb->expr()->eq('q.deleted', ':false'),
                    $qb->expr()->eq('q.unitId', ':unitId')
                )
            )
            ->setParameter('search', '%' . $searchString . '%')
            ->setParameter('false', false)
            ->setParameter('unitId', $unitId);

        $queryResult = $qb->getQuery()->getResult();

        $result = [];
        foreach ($queryResult as $row) {
            $result[] = ['id' => $row['id'], 'name' => $row['number']];
        }

        return $result;
    }
}