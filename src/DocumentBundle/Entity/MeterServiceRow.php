<?php

namespace DocumentBundle\Entity;

use CoreBundle\BaseClasses\DocumentEntityAbstract;
use Doctrine\ORM\Mapping as ORM;
use KontragentBundle\Entity\Meter;
use KontragentBundle\Entity\Service;

/**
 * MeterServiceRow
 *
 * @ORM\Table(name="document_meters_service_row")
 * @ORM\Entity(repositoryClass="DocumentBundle\Repository\MeterServiceRowRepository")
 */
class MeterServiceRow extends DocumentEntityAbstract
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created", type="datetime")
     */
    protected $created;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="updated", type="datetime")
     */
    protected $updated;

    /**
     * @var bool
     *
     * @ORM\Column(name="deleted", type="integer")
     */
    protected $deleted;

    /**
     * @var MeterServiceDocument
     *
     * @ORM\ManyToOne(targetEntity="MeterServiceDocument", inversedBy="rows")
     * @ORM\JoinColumn(name="document_id", referencedColumnName="id")
     */
    private $document;

    /**
     * @var Service
     *
     * @ORM\ManyToOne(targetEntity="\KontragentBundle\Entity\Service")
     * @ORM\JoinColumn(name="service_id", referencedColumnName="id")
     */
    private $service;

    /**
     * @var Meter
     *
     * @ORM\ManyToOne(targetEntity="\KontragentBundle\Entity\Meter")
     * @ORM\JoinColumn(name="meter_id", referencedColumnName="id")
     */
    private $meter;

    /**
     * @var float
     *
     * @ORM\Column(name="start_data", type="decimal", precision=8, scale=3)
     */
    private $startData;

    /**
     * @var float
     *
     * @ORM\Column(name="end_data", type="decimal", precision=8, scale=3)
     */
    private $endData;

    /**
     * @var float
     *
     * @ORM\Column(name="price", type="decimal", precision=7, scale=2)
     */
    private $price;

    /**
     * @var float
     *
     * @ORM\Column(name="sum", type="decimal", precision=8, scale=3)
     */
    private $sum;

    /**
     * @return MeterServiceDocument
     */
    public function getDocument()
    {
        return $this->document;
    }

    /**
     * @param MeterServiceDocument $document
     * @return $this
     */
    public function setDocument(MeterServiceDocument $document)
    {
        $this->document = $document;

        return $this;
    }

    /**
     * @return Service
     */
    public function getService()
    {
        return $this->service;
    }

    /**
     * @param Service $service
     * @return $this
     */
    public function setService(Service $service)
    {
        $this->service = $service;

        return $this;
    }

    /**
     * @return Meter
     */
    public function getMeter()
    {
        return $this->meter;
    }

    /**
     * @param Meter $meter
     * @return $this
     */
    public function setMeter(Meter $meter)
    {
        $this->meter = $meter;

        return $this;
    }

    /**
     * @return float
     */
    public function getStartData()
    {
        return $this->startData;
    }

    /**
     * @param float $data
     * @return $this
     */
    public function setStartData($data)
    {
        $this->startData = $data;

        return $this;
    }

    /**
     * @return float
     */
    public function getEndData()
    {
        return $this->endData;
    }

    /**
     * @param float $data
     * @return $this
     */
    public function setEndData($data)
    {
        $this->endData = $data;

        return $this;
    }

    /**
     * @return float
     */
    public function getPrice()
    {
        return $this->price;
    }

    /**
     * @param float $price
     * @return $this
     */
    public function setPrice($price)
    {
        $this->price = $price;

        return $this;
    }

    /**
     * @return float
     */
    public function getSum()
    {
        return $this->sum;
    }

    /**
     * @param float $sum
     * @return $this
     */
    public function setSum($sum)
    {
        $this->sum = $sum;

        return $this;
    }
}