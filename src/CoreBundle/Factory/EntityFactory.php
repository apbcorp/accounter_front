<?php

namespace CoreBundle\Factory;

use CoreBundle\Entity\Users;
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
     * @return Users
     */
    public function createUser()
    {
        return new Users();
    }
} 