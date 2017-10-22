<?php

namespace DocumentBundle\Service;

use Doctrine\ORM\EntityManager;
use DocumentBundle\Entity\MeterServiceRow;
use DocumentBundle\Entity\PayRow;
use DocumentBundle\Entity\ServiceRow;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\Service;

class DebtGenerator
{
    /**
     * @var EntityManager
     */
    private $em;

    /**
     * DebtGenerator constructor.
     * @param EntityManager $em
     */
    public function __construct(EntityManager $em)
    {
        $this->em = $em;
    }

    /**
     * @param \DateTime $date
     * @param int       $groundId
     * @param int       $unitId
     * @return array
     */
    public function getDebtByGround(\DateTime $date, $groundId, $unitId)
    {
        $services = $this->em->getRepository(Service::class)->findBy(['deleted' => false, 'unitId' => $unitId]);
        /** @var Ground $ground */
        $ground = $this->em->getRepository(Ground::class)->find($groundId);
        
        $result = [];
        foreach ($services as $service) {
            $result[] = $this->getDebtByService($date, $ground, $service);
        }

        return $result;
    }

    /**
     * @param \DateTime $date
     * @param Ground    $ground
     * @param Service   $service
     * @return array
     */
    public function getDebtByService(\DateTime $date, Ground $ground, Service $service)
    {
        $pays = $this->em->getRepository(PayRow::class)->getPays($date, $ground, $service);
        $debts = $this->em->getRepository(ServiceRow::class)->getDebt($date, $ground, $service)
            + $this->em->getRepository(MeterServiceRow::class)->getDebt($date, $ground, $service);

        return [
            'ground' => $ground->getAccNumber(),
            'groundId' => $ground->getId(),
            'serviceId' => $service->getId(),
            'service' => $service->getName(),
            'sum' => $debts - $pays
        ];
    }
}