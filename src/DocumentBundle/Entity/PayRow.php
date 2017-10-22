<?php

namespace DocumentBundle\Entity;

use CoreBundle\BaseClasses\Interfaces\DocumentEntityInterface;
use Doctrine\ORM\Mapping as ORM;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\Service;

/**
 * PayRow
 *
 * @ORM\Table(name="document_pay_row")
 * @ORM\Entity(repositoryClass="DocumentBundle\Repository\PayRowRepository")
 */
class PayRow implements DocumentEntityInterface
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
     * @var PayDocument
     *
     * @ORM\ManyToOne(targetEntity="PayDocument", inversedBy="rows")
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
     * @var Service
     *
     * @ORM\ManyToOne(targetEntity="\KontragentBundle\Entity\Service")
     * @ORM\JoinColumn(name="service_id", referencedColumnName="id")
     */
    private $service;

    /**
     * @var Ground
     *
     * @ORM\ManyToOne(targetEntity="\KontragentBundle\Entity\Ground")
     * @ORM\JoinColumn(name="ground_id", referencedColumnName="id")
     */
    private $ground;

    /**
     * @var float
     *
     * @ORM\Column(name="price", type="decimal", precision=7, scale=2)
     */
    private $sum;

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
     * @return TarifDocument
     */
    public function getDocument()
    {
        return $this->document;
    }

    /**
     * @param PayDocument $document
     * @return $this
     */
    public function setDocument(PayDocument $document)
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
    public function getSum()
    {
        return $this->sum;
    }

    /**
     * @param $sum
     * @return $this
     */
    public function setSum($sum)
    {
        $this->sum = $this->toFloat($sum);

        return $this;
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
     * @return Ground
     */
    public function getGround()
    {
        return $this->ground;
    }
}