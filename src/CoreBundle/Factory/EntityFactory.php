<?php

namespace CoreBundle\Factory;

use CoreBundle\Entity\User;
use CoreBundle\Entity\Token;

class EntityFactory
{
    /**
     * @return Token
     */
    public function createToken()
    {
        return new Token();
    }

    /**
     * @return User
     */
    public function createUser()
    {
        return new User();
    }
} 