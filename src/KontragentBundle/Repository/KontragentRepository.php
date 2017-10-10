<?php

namespace KontragentBundle\Repository;

use CoreBundle\BaseClasses\Interfaces\SupplyRepositoryInterface;
use CoreBundle\BaseClasses\ListRepositoryAbstract;

class KontragentRepository extends ListRepositoryAbstract implements SupplyRepositoryInterface
{
    /**
     * @param string $searchString
     * @param int    $unitId
     * @return array
     */
    public function search($searchString, $unitId)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('q.id, q.name, q.surname, q.name2')
            ->from($this->getEntityName(), 'q')
            ->where(
                $qb->expr()->andX(
                    $qb->expr()->orX(
                        $qb->expr()->like('q.id', ':search'),
                        $qb->expr()->like('q.name', ':search'),
                        $qb->expr()->like('q.surname', ':search'),
                        $qb->expr()->like('q.name2', ':search')
                    ),
                    $qb->expr()->eq('q.deleted', ':false'),
                    $qb->expr()->eq('q.unitId', ':unitId')
                )
            )
            ->setParameter('search', '%' . $searchString . '%')
            ->setParameter('false', false)
            ->setParameter('unitId', $unitId)
            ->setMaxResults(self::MAX_RESULT);

        $queryResult = $qb->getQuery()->getResult();

        $result = [];
        foreach ($queryResult as $row) {
            $result[] = ['id' => $row['id'], 'name' => implode(' ', [$row['surname'], $row['name'], $row['name2']])];
        }

        return $result;
    }
}