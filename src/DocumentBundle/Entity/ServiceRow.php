<?php

namespace DocumentBundle\Entity;

use CoreBundle\BaseClasses\DocumentEntityAbstract;
use Doctrine\ORM\Mapping as ORM;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\Service;
use Symfony\Component\Validator\Constraints\DateTime;

/**
 * ServiceRow
 *
 * @ORM\Table(name="document_service_row")
 * @ORM\Entity(repositoryClass="DocumentBundle\Repository\ServiceRowRepository")
 */
class ServiceRow extends DocumentEntityAbstract
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
     * @var bool
     *
     * @ORM\Column(name="deleted", type="integer")
     */
    private $deleted;

    /**
     * @var ServiceDocument
     *
     * @ORM\ManyToOne(targetEntity="ServiceDocument", inversedBy="rows")
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
     * @var Ground
     *
     * @ORM\ManyToOne(targetEntity="\KontragentBundle\Entity\Ground")
     * @ORM\JoinColumn(name="ground_id", referencedColumnName="id")
     */
    private $ground;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date", type="datetime")
     */
    private $date;

    /**
     * @var float
     *
     * @ORM\Column(name="price", type="decimal", precision=7, scale=2)
     */
    private $price;

    /**
     * @var float
     *
     * @ORM\Column(name="count", type="decimal", precision=8, scale=3)
     */
    private $count;

    /**
     * @var float
     *
     * @ORM\Column(name="sum", type="decimal", precision=8, scale=3)
     */
    private $sum;

    /**
     * @return ServiceDocument
     */
    public function getDocument()
    {
        return $this->document;
    }

    /**
     * @param ServiceDocument $document
     * @return $this
     */
    public function setDocument(ServiceDocument $document)
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
    public function getCount()
    {
        return $this->count;
    }

    /**
     * @param float $count
     * @return $this
     */
    public function setCount($count)
    {
        $this->count = $count;

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