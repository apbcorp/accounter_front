<?php

namespace CoreBundle\Factory;

use CoreBundle\Entity\Users;
use CoreBundle\Entity\Token;
use DocumentBundle\Entity\MeterDocument;
use DocumentBundle\Entity\MeterRow;
use DocumentBundle\Entity\MeterServiceDocument;
use DocumentBundle\Entity\MeterServiceRow;
use DocumentBundle\Entity\PayDocument;
use DocumentBundle\Entity\PayRow;
use DocumentBundle\Entity\ServiceDocument;
use DocumentBundle\Entity\ServiceRow;
use DocumentBundle\Entity\TarifDocument;
use DocumentBundle\Entity\TarifRow;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\GroundParts;
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

    /**
     * @return TarifRow
     */
    public function createTarifRow()
    {
        return new TarifRow();
    }

    /**
     * @return MeterDocument
     */
    public function createMeterDocument()
    {
        return new MeterDocument();
    }

    /**
     * @return MeterRow
     */
    public function createMeterRow()
    {
        return new MeterRow();
    }

    /**
     * @return GroundParts
     */
    public function createGroundPart()
    {
        return new GroundParts();
    }

    /**
     * @return ServiceDocument
     */
    public function createServiceDocument()
    {
        return new ServiceDocument();
    }

    /**
     * @return ServiceRow
     */
    public function createServiceRow()
    {
        return new ServiceRow();
    }

    /**
     * @return MeterServiceDocument
     */
    public function createMeterServiceDocument()
    {
        return new MeterServiceDocument();
    }

    /**
     * @return MeterServiceRow
     */
    public function createMeterServiceRow()
    {
        return new MeterServiceRow();
    }

    /**
     * @return PayDocument
     */
    public function createPayDocument()
    {
        return new PayDocument();
    }

    /**
     * @return PayRow
     */
    public function createPayRow()
    {
        return new PayRow();
    }
} 