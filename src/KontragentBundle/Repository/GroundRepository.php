<?php

namespace KontragentBundle\Repository;

use CoreBundle\BaseClasses\Interfaces\SupplyRepositoryInterface;
use CoreBundle\BaseClasses\ListRepositoryAbstract;

class GroundRepository extends ListRepositoryAbstract implements SupplyRepositoryInterface
{
    /**
     * @param $searchString
     * @return array
     */
    public function search($searchString)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('q.id, q.accNumber, q.number')
            ->from($this->getEntityName(), 'q')
            ->where(
                $qb->expr()->orX(
                    $qb->expr()->like('q.id', ':search'),
                    $qb->expr()->like('q.accNumber', ':search'),
                    $qb->expr()->like('q.number', ':search')
                )
            )
            ->setParameter('search', '%' . $searchString . '%');
        
        $queryResult = $qb->getQuery()->getResult();

        $result = [];
        foreach ($queryResult as $row) {
            $result[] = ['id' => $row['id'], 'name' => 'Л/с ' . $row['accNumber'] . ' курень ' . $row['number']];
        }

        return $result;
    }
}