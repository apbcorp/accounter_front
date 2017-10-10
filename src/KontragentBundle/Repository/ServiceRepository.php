<?php

namespace KontragentBundle\Repository;

use CoreBundle\BaseClasses\Interfaces\SupplyRepositoryInterface;
use CoreBundle\BaseClasses\ListRepositoryAbstract;

class ServiceRepository extends ListRepositoryAbstract implements SupplyRepositoryInterface
{
    /**
     * @param string $searchString
     * @param int    $unitId
     * @return array
     */
    public function search($searchString, $unitId)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('q.id, q.name')
            ->from($this->getEntityName(), 'q')
            ->where(
                $qb->expr()->andX(
                    $qb->expr()->orX(
                        $qb->expr()->like('q.id', ':search'),
                        $qb->expr()->like('q.name', ':search')
                    )
                ),
                $qb->expr()->eq('q.deleted', ':false')
            )
            ->setParameter('search', '%' . $searchString . '%')
            ->setParameter('false', false)
            ->setMaxResults(self::MAX_RESULT);

        $queryResult = $qb->getQuery()->getResult();

        $result = [];
        foreach ($queryResult as $row) {
            $result[] = ['id' => $row['id'], 'name' => $row['name']];
        }

        return $result;
    }
}