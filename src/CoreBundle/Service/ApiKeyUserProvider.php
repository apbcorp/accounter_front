<?php

namespace CoreBundle\Service;

use CoreBundle\Entity\Token;
use CoreBundle\Factory\EntityFactory;
use Doctrine\ORM\EntityManager;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\User\User;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;

class ApiKeyUserProvider implements UserProviderInterface
{
    /**
     * @var EntityManager
     */
    private $em;

    /**
     * @var EntityFactory
     */
    private $entityFactory;

    public function __construct(EntityManager $em, EntityFactory $entityFactory)
    {
        $this->em = $em;
        $this->entityFactory = $entityFactory;
    }

    public function getUsernameForApiKey($apiKey)
    {
        $username = $this->em->getRepository(Token::class)->findByToken($apiKey);

        return $username;
    }

    public function loadUserByUsername($username)
    {
        return new User(
            $username,
            null,
            []
        );
    }

    public function refreshUser(UserInterface $user)
    {
        throw new UnsupportedUserException();
    }

    public function supportsClass($class)
    {
        return User::class === $class;
    }
}