<?php

namespace DocumentBundle\Service;

use CoreBundle\Dictionary\MetricTypeDictionary;
use Doctrine\ORM\EntityManager;
use DocumentBundle\Entity\MeterRow;
use DocumentBundle\Entity\MeterServiceRow;
use DocumentBundle\Entity\TarifRow;
use DocumentBundle\Repository\MeterRowRepository;
use DocumentBundle\Repository\MeterServiceRowRepository;
use DocumentBundle\Repository\TarifRowRepository;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\Meter;
use KontragentBundle\Entity\Service;

class MeterServiceGenerator
{
    /**
     * @var EntityManager
     */
    private $em;

    /**
     * MeterServiceGenerator constructor.
     * @param EntityManager $em
     */
    public function __construct(EntityManager $em)
    {
        $this->em = $em;
    }

    /**
     * @param \DateTime $date
     * @param Meter     $meter
     * @param Service   $service
     * @return array
     */
    public function generateByMeter(\DateTime $date, Meter $meter, Service $service)
    {
        /** @var MeterServiceRowRepository $meterServiceRepo */
        $meterServiceRepo = $this->em->getRepository(MeterServiceRow::class);
        /** @var MeterRowRepository $meterRepo */
        $meterRepo = $this->em->getRepository(MeterRow::class);
        /** @var TarifRowRepository $tarifRepo */
        $tarifRepo = $this->em->getRepository(TarifRow::class);

        $result = [
            'startData' => $meterServiceRepo->getEndValueByDate($meter, $date),
            'endData' => $meterRepo->getEndValueByDate($meter, $date),
            'price' => $tarifRepo->getPrice($service, $date),
            'meterId' => $meter->getId(),
            'date' => $date->format('Y-m-d')
        ];

        $result['sum'] = $result['endDate'] > $result['startDate']
            ? ($result['endDate'] - $result['startDate']) * $result['price']
            : 0;

        return $result;
    }

    /**
     * @param \DateTime $date
     * @param int       $groundId
     * @return array
     * @throws \Doctrine\ORM\ORMException
     */
    public function generateByGroundId(\DateTime $date, $groundId, $unitId)
    {
        $groundReference = $this->em->getReference(Ground::class, $groundId);
        $meterList = $this->em->getRepository(Meter::class)->find(['deleted' => false, 'ground' => $groundReference]);

        $result = [];
        /** @var Meter $meter */
        foreach ($meterList as $meter) {
            $serviceSubType = MetricTypeDictionary::getServiceSubtypeByType($meter->getType());
            /** @var Service $service */
            $service = $this->em->getRepository(Service::class)->findOneBy([
                'deleted' => false,
                'unitId' => $unitId,
                'subtype' => $serviceSubType
            ]);
            $result[] = $this->generateByMeter($date, $meter, $service);
        }

        return $result;
    }
}