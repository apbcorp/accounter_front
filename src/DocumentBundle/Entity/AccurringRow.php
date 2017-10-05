<?php

namespace DocumentBundle\Entity;

use CoreBundle\BaseClasses\Interfaces\DocumentEntityInterface;
use Doctrine\ORM\Mapping as ORM;
use KontragentBundle\Entity\Service;

/**
 * AccurringRow
 *
 * @ORM\Table(name="document_accurring_row")
 * @ORM\Entity(repositoryClass="DocumentBundle\Repository\AccurringRowRepository")
 */
class AccurringRow implements DocumentEntityInterface
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created", type="datetime")
     */
    private $created;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="updated", type="datetime")
     */
    private $updated;

    /**
     * @var AccurringDocument
     *
     * @ORM\ManyToOne(targetEntity="AccurringDocument", inversedBy="rows")
     * @ORM\JoinColumn(name="document_id", referencedColumnName="id")
     */
    private $document;

    /**
     * @var bool
     *
     * @ORM\Column(name="deleted", type="integer")
     */
    private $deleted;

    /**
     * @var float
     *
     * @ORM\Column(name="price", type="decimal", precision=7, scale=2)
     */
    private $price;

    /**
     * @var Service
     *
     * @ORM\ManyToOne(targetEntity="\KontragentBundle\Entity\Service")
     * @ORM\JoinColumn(name="service_id", referencedColumnName="id")
     */
    private $service;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="period", type="datetime")
     */
    private $period;

    /**
     * @var float
     *
     * @ORM\Column(name="calc_base", type="decimal", precision=11, scale=3)
     */
    private $calcBase;

    /**
     * @var string
     *
     * @ORM\Column(name="komment", type="string", length=255)
     */
    private $komment;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return \DateTime
     */
    public function getCreated()
    {
        return $this->created;
    }

    /**
     * @param \DateTime $date
     * @return $this
     */
    public function setCreated(\DateTime $date)
    {
        $this->created = $date;

        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getUpdated()
    {
        return $this->updated;
    }

    /**
     * @param \DateTime $date
     * @return $this
     */
    public function setUpdated(\DateTime $date)
    {
        $this->updated = $date;

        return $this;
    }

    /**
     * @return bool
     */
    public function isDeleted()
    {
        return $this->deleted;
    }

    /**
     * @param bool $deleted
     * @return $this
     */
    public function setIsDeleted($deleted)
    {
        $this->deleted = $deleted;

        return $this;
    }

    /**
     * @return AccurringDocument
     */
    public function getDocument()
    {
        return $this->document;
    }

    /**
     * @param AccurringDocument $document
     * @return $this
     */
    public function setDocument(AccurringDocument $document)
    {
        $this->document = $document;

        return $this;
    }

    /**
     * @param string $value
     * @return string
     */
    private function toFloat($value)
    {
        return str_replace(',', '.', $value);
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
        $this->price = $this->toFloat($price);

        return $this;
    }

    /**
     * @return float
     */
    public function getSum()
    {
        return $this->price * $this->calcBase;
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
     * @return \DateTime
     */
    public function getPeriod()
    {
        return $this->period;
    }

    /**
     * @param \DateTime $period
     * @return $this
     */
    public function setPeriod(\DateTime $period)
    {
        $this->period = $period;

        return $this;
    }

    /**
     * @return float
     */
    public function getCalcBase()
    {
        return $this->calcBase;
    }

    /**
     * @param float $calcBase
     * @return $this
     */
    public function setCalcBase($calcBase)
    {
        $this->calcBase = $this->toFloat($calcBase);

        return $this;
    }

    /**
     * @return string
     */
    public function getKomment()
    {
        return $this->komment;
    }

    /**
     * @param string $komment
     * @return $this
     */
    public function setKomment($komment)
    {
        $this->komment = $komment;

        return $this;
    }
}