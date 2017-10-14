<?php

namespace KontragentBundle\Repository;

use CoreBundle\BaseClasses\Interfaces\SupplyRepositoryInterface;
use CoreBundle\BaseClasses\ListRepositoryAbstract;
use Doctrine\ORM\Query\Expr\Join;
use KontragentBundle\Entity\Kontragent;

class GroundRepository extends ListRepositoryAbstract implements SupplyRepositoryInterface
{
    /**
     * @param string $searchString
     * @param int    $unitId
     * @return array
     */
    public function search($searchString, $unitId)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('q.id, q.accNumber, q.number, k.name, k.name2, k.surname')
            ->from($this->getEntityName(), 'q')
            ->join(Kontragent::class, 'k', Join::WITH, 'k.id = q.kontragent')
            ->where(
                $qb->expr()->andX(
                    $qb->expr()->orX(
                        $qb->expr()->like('q.id', ':search'),
                        $qb->expr()->like('q.accNumber', ':search'),
                        $qb->expr()->like('q.number', ':search'),
                        $qb->expr()->like('k.name', ':search'),
                        $qb->expr()->like('k.name2', ':search'),
                        $qb->expr()->like('k.surname', ':search')
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
            $result[] = [
                'id' => $row['id'],
                'name' => 'Л/с ' . $row['accNumber'] . ' (' . implode(' ',[
                        $row['surname'],
                        mb_substr($row['name'], 0, 1) . '.',
                        mb_substr($row['name2'], 0, 1) . '.'
                    ]) . ')'
            ];
        }

        return $result;
    }
}