<?php

namespace CoreBundle\BaseClasses;

use Doctrine\ORM\EntityRepository;
use Symfony\Component\Validator\Constraints\Date;

abstract class ListRepositoryAbstract extends EntityRepository
{
    const PERIOD_START_PARAMETER = 'periodStart';
    const PERIOD_END_PARAMETER = 'periodEnd';

    /**
     * @var string
     */
    protected $dateField = 'created';

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

        $qb = $this->getQuery($filters);
        $qb->orderBy('q.' . array_keys($order)[0], reset($order))
            ->setFirstResult($offset)
            ->setMaxResults($limit);

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

    /**
     * @param array $filters
     * @return \Doctrine\ORM\QueryBuilder
     */
    protected function getQuery(array $filters)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('q')
            ->from($this->getEntityName(), 'q');

        foreach ($filters as $field => $value) {
            switch ($field) {
                case self::PERIOD_START_PARAMETER:
                    $qb->andWhere($qb->expr()->gte('q.' . $this->dateField, ':' . $field))
                        ->setParameter($field, $value);

                    break;
                case self::PERIOD_END_PARAMETER:
                    $qb->andWhere($qb->expr()->lte('q.' . $this->dateField, ':' . $field))
                        ->setParameter($field, $value);

                    break;
                default:
                    $qb->andWhere($qb->expr()->eq('q.' . $field, ':' . $field))
                        ->setParameter($field, $value);
            }
        }

        return $qb;
    }
}