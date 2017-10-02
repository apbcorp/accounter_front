<?php

namespace CoreBundle\Factory;

use CoreBundle\Entity\Users;
use CoreBundle\Entity\Token;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\Kontragent;

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

    /**
     * @return Kontragent
     */
    public function createKontragent()
    {
        return new Kontragent();
    }

    /**
     * @return Ground
     */
    public function createGround()
    {
        return new Ground();
    }
} 