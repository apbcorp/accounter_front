<?php

namespace DocumentBundle\Entity;

use CoreBundle\BaseClasses\Interfaces\DocumentEntityInterface;
use Doctrine\ORM\Mapping as ORM;
use KontragentBundle\Entity\Meter;

/**
 * MeterRow
 *
 * @ORM\Table(name="document_meter_row")
 * @ORM\Entity(repositoryClass="DocumentBundle\Repository\MeterRowRepository")
 */
class MeterRow implements DocumentEntityInterface
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
     * @var MeterDocument
     *
     * @ORM\ManyToOne(targetEntity="MeterDocument", inversedBy="rows")
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
     * @var Meter
     *
     * @ORM\ManyToOne(targetEntity="\KontragentBundle\Entity\Meter")
     * @ORM\JoinColumn(name="meter_id", referencedColumnName="id")
     */
    private $meter;

    /**
     * @var float
     *
     * @ORM\Column(name="start_value", type="decimal", precision=11, scale=3)
     */
    private $startValue;

    /**
     * @var float
     *
     * @ORM\Column(name="end_value", type="decimal", precision=11, scale=3)
     */
    private $endValue;

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
     * @return MeterDocument
     */
    public function getDocument()
    {
        return $this->document;
    }

    /**
     * @param MeterDocument $document
     * @return $this
     */
    public function setDocument(MeterDocument $document)
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
    public function getStartValue()
    {
        return $this->startValue;
    }

    /**
     * @param float $value
     * @return $this
     */
    public function setStartValue($value)
    {
        $this->startValue = $this->toFloat($value);

        return $this;
    }

    /**
     * @return float
     */
    public function getEndValue()
    {
        return $this->endValue;
    }

    /**
     * @param float $value
     * @return $this
     */
    public function setEndValue($value)
    {
        $this->endValue = $this->toFloat($value);

        return $this;
    }
}