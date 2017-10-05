<?php

namespace DocumentBundle\Repository;

use CoreBundle\BaseClasses\ListRepositoryAbstract;
use Doctrine\ORM\Query\Expr\Join;
use DocumentBundle\Entity\MeterRow;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\Kontragent;
use KontragentBundle\Entity\Meter;

class MeterDocumentRepository extends ListRepositoryAbstract
{
    /**
     * @param $searchString
     * @return array
     */
    public function search($searchString)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('q.id, q.number, k.surname, k.name, k.name2')
            ->from(Meter::class, 'q')
            ->where(
                $qb->expr()->orX(
                    $qb->expr()->like('q.id', ':search'),
                    $qb->expr()->like('q.number', ':search')
                )
            )
            ->setParameter('search', '%' . $searchString . '%')
            ->join(Ground::class, 'g', Join::WITH,'q.ground = g.id')
            ->join(Kontragent::class, 'k', Join::WITH, 'k.id = g.kontragent');

        $queryResult = $qb->getQuery()->getResult();

        $result = [];
        foreach ($queryResult as $row) {
            $qb = $this->getEntityManager()->createQueryBuilder();
            $qb->select('q.endValue')
                ->from(MeterRow::class, 'q')
                ->where(
                    $qb->expr()->eq('q.meter', ':id')
                )
                ->setParameter('id', $row['id'])
                ->orderBy('q.created', 'desc')
                ->setMaxResults(1);

            $res = $qb->getQuery()->getResult();

            $result[] = [
                'id' => $row['id'],
                'name' => '№ ' . $row['number'] . ' собственник ' . implode(' ', [$row['surname'], $row['name'], $row['name2']]),
                'value' => isset($res[0]) ? $res[0]['endValue'] : 0
            ];
        }

        return $result;
    }
}