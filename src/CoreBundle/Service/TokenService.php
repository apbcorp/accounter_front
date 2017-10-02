<?php

namespace CoreBundle\Service;

use CoreBundle\Entity\User;
use CoreBundle\Factory\EntityFactory;
use Doctrine\ORM\EntityManager;
use CoreBundle\Entity\Token;
use Symfony\Component\Security\Acl\Exception\Exception;

class TokenService
{
    private $secret = 'APB Incorporated';

    /**
     * @var EntityManager
     */
    private $em;

    /**
     * @var EntityFactory
     */
    private $entityFactory;

    /**
     * @var Token
     */
    private $entity;

    public function __construct(EntityManager $em, EntityFactory $entityFactory)
    {
        $this->em = $em;
        $this->entityFactory = $entityFactory;
    }

    /**
     * @param User $user
     * @return string
     */
    public function generateNewToken(User $user)
    {
        $this->destroyCurrentToken();

        do {
            $params = [
                $user->getUsername(),
                $user->getPassword(),
                date('Y-m-d H:i:s', time() + 86400),
                rand(0, 17)
            ];

            $token = md5(implode($this->secret, $params));
            $entity = $this->em->getRepository(Token::class)->findByToken($token);
        } while (!empty($entity));

        $entity = $this->entityFactory->createToken();
        $entity->setUser($user)
            ->setToken($token)
            ->setExpiration($this->getNewExpirationDate());

        $this->entity = $entity;

        $this->saveToken();

        return $token;
    }

    /**
     * @return bool
     */
    public function destroyCurrentToken()
    {
        if (!$this->entity) {
            return false;
        }

        $this->entity->setExpiration(new \DateTime('-1 day'));
        $this->saveToken();

        return true;
    }

    /**
     * @param User $user
     * @return string
     */
    public function refreshToken()
    {
        $interval = date_diff($this->entity->getExpiration(), new \DateTime());

        $token = '';
        if ($interval->format('%h') < 1) {
            $this->entity->setExpiration($this->getNewExpirationDate());
        }

        return $token;
    }

    /**
     * @param string $token
     * @return Token
     */
    public function getTokenEntity($token = null)
    {
        if ($token) {
            /** @var Token entity */
            $entity = $this->em->getRepository(Token::class)->findByToken($token);

            if ($entity) {
                $this->entity = $entity[0];
            } else {
                $this->entity = null;
            }
        }

        return $this->entity;
    }

    /**
     * @return \DateTime
     */
    private function getNewExpirationDate()
    {
        return new \DateTime(Token::LIFETIME);
    }

    private function saveToken()
    {
        $this->em->persist($this->entity);
        $this->em->flush();
    }
} 