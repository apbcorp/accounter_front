<?php

namespace CoreBundle\Factory;

use CoreBundle\Entity\Users;
use CoreBundle\Entity\Token;
use DocumentBundle\Entity\TarifDocument;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\Kontragent;
use KontragentBundle\Entity\Meter;
use KontragentBundle\Entity\Service;

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

    /**
     * @return Meter
     */
    public function createMeter()
    {
        return new Meter();
    }

    /**
     * @return Service
     */
    public function createService()
    {
        return new Service();
    }

    /**
     * @return TarifDocument
     */
    public function createTarifDocument()
    {
        return new TarifDocument();
    }
} 