<?php

namespace KontragentBundle\Repository;

use CoreBundle\BaseClasses\Interfaces\SupplyRepositoryInterface;
use CoreBundle\BaseClasses\ListRepositoryAbstract;

class KontragentRepository extends ListRepositoryAbstract implements SupplyRepositoryInterface
{
    /**
     * @param $searchString
     * @return array
     */
    public function search($searchString)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('q.id, q.name, q.surname, q.name2')
            ->from($this->getEntityName(), 'q')
            ->where(
                $qb->expr()->orX(
                    $qb->expr()->like('q.id', ':search'),
                    $qb->expr()->like('q.name', ':search'),
                    $qb->expr()->like('q.surname', ':search'),
                    $qb->expr()->like('q.name2', ':search')
                )
            )
            ->setParameter('search', '%' . $searchString . '%');

        $queryResult = $qb->getQuery()->getResult();

        $result = [];
        foreach ($queryResult as $row) {
            $result[] = ['id' => $row['id'], 'name' => implode(' ', [$row['surname'], $row['name'], $row['name2']])];
        }

        return $result;
    }
}