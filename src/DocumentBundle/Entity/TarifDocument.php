<?php

namespace DocumentBundle\Entity;

use CoreBundle\BaseClasses\Interfaces\DocumentEntityInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * TarifDocument
 *
 * @ORM\Table(name="document_tarif")
 * @ORM\Entity(repositoryClass="DocumentBundle\Repository\TarifDocumentRepository")
 */
class TarifDocument implements DocumentEntityInterface
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
     * @ORM\Column(name="date_start", type="datetime")
     */
    private $dateStart;

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
     * @var ArrayCollection
     *
     * @ORM\OneToMany(targetEntity="TarifRow", mappedBy="document")
     */
    private $rows;

    /**
     * @var bool
     *
     * @ORM\Column(name="deleted", type="integer")
     */
    private $deleted;

    /**
     * @var int
     *
     * @ORM\Column(name="unit_id", type="integer")
     */
    private $unitId;

    /**
     * TarifDocument constructor.
     */
    public function __construct()
    {
        $this->rows = new ArrayCollection();
    }

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
    public function getDateStart()
    {
        return $this->dateStart;
    }

    /**
     * @param \DateTime $date
     * @return $this
     */
    public function setDateStart(\DateTime $date)
    {
        $this->dateStart = $date;

        return $this;
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
     * @return ArrayCollection
     */
    public function getRows()
    {
        return $this->rows;
    }

    /**
     * @param TarifRow $row
     * @return $this
     */
    public function addRow(TarifRow $row)
    {
        $this->rows->add($row);

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
     * @return int
     */
    public function getUnitId()
    {
        return $this->unitId;
    }

    /**
     * @param int $unitId
     * @return $this
     */
    public function setUnitId($unitId)
    {
        $this->unitId = $unitId;

        return $this;
    }
}