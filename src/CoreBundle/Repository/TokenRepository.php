<?php

namespace CoreBundle\Repository;

use Doctrine\ORM\EntityRepository;
use CoreBundle\Entity\Token;

class TokenRepository extends EntityRepository
{
    /**
     * @var string
     */
    private $alias = 't';

    /**
     * @param $token
     * @return Token[]
     */
    public function findByToken($token)
    {
        $query = $this->createQueryBuilder($this->alias);
        $query->where(
            $query->expr()->andX(
                $query->expr()->eq($this->alias.'.token', ':token'),
                $query->expr()->gt($this->alias.'.expiration', ':expiration')
            )
        )
        ->setParameter('token', $token)
        ->setParameter('expiration', new \DateTime());

        return $query->getQuery()->getResult();
    }
} 