<?php

namespace DocumentBundle\Entity;

use CoreBundle\BaseClasses\DocumentEntityAbstract;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use KontragentBundle\Entity\Ground;

/**
 * MeterServiceDocument
 *
 * @ORM\Table(name="document_meter_service")
 * @ORM\Entity(repositoryClass="DocumentBundle\Repository\MeterServiceDocumentRepository")
 */
class MeterServiceDocument extends DocumentEntityAbstract
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
     * @var ArrayCollection
     *
     * @ORM\OneToMany(targetEntity="MeterServiceRow", mappedBy="document")
     */
    private $rows;

    /**
     * @var bool
     *
     * @ORM\Column(name="deleted", type="integer")
     */
    protected $deleted;

    /**
     * @var Ground
     *
     * @ORM\ManyToOne(targetEntity="\KontragentBundle\Entity\Ground")
     * @ORM\JoinColumn(name="ground_id", referencedColumnName="id")
     */
    private $ground;

    /**
     * @var integer
     *
     * @ORM\Column(name="ground_id", type="integer")
     */
    private $groundId;

    /**
     * @var int
     *
     * @ORM\Column(name="unit_id", type="integer")
     */
    private $unitId;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date", type="datetime")
     */
    private $date;

    /**
     * ServiceDocument constructor.
     */
    public function __construct()
    {
        $this->rows = new ArrayCollection();
    }

    /**
     * @return ArrayCollection
     */
    public function getRows()
    {
        return $this->rows;
    }

    /**
     * @param ServiceRow $row
     * @return $this
     */
    public function addRow(ServiceRow $row)
    {
        $this->rows->add($row);

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

    /**
     * @return Ground
     */
    public function getGround()
    {
        return $this->ground;
    }

    /**
     * @param Ground $ground
     * @return $this
     */
    public function setGround(Ground $ground)
    {
        $this->ground = $ground;

        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * @param \DateTime $date
     * @return $this
     */
    public function setDate(\DateTime $date)
    {
        $this->date = $date;

        return $this;
    }
}