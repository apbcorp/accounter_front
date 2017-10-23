<?php

namespace DocumentBundle\Entity;

use CoreBundle\BaseClasses\Interfaces\DocumentEntityInterface;
use Doctrine\ORM\Mapping as ORM;
use KontragentBundle\Entity\Service;

/**
 * TarifRow
 *
 * @ORM\Table(name="document_tarif_row")
 * @ORM\Entity(repositoryClass="DocumentBundle\Repository\TarifRowRepository")
 */
class TarifRow implements DocumentEntityInterface
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
     * @var Service
     *
     * @ORM\ManyToOne(targetEntity="\KontragentBundle\Entity\Service")
     * @ORM\JoinColumn(name="service_id", referencedColumnName="id")
     */
    private $service;

    /**
     * @var float
     *
     * @ORM\Column(name="price", type="decimal", precision=7, scale=2)
     */
    private $price;

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
     * @var TarifDocument
     *
     * @ORM\ManyToOne(targetEntity="TarifDocument", inversedBy="rows")
     * @ORM\JoinColumn(name="document_id", referencedColumnName="id")
     */
    private $document;

    /**
     * @var bool
     *
     * @ORM\Column(name="deleted", type="integer")
     */
    protected $deleted;

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
     * @return TarifDocument
     */
    public function getDocument()
    {
        return $this->document;
    }

    /**
     * @param TarifDocument $document
     * @return $this
     */
    public function setDocument(TarifDocument $document)
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
}