<?php

namespace DocumentBundle\EntityFormatter;

use CoreBundle\BaseClasses\EntityFormatterAbstract;
use DocumentBundle\Entity\MeterServiceDocument;
use DocumentBundle\Entity\MeterServiceRow;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\Meter;
use KontragentBundle\Entity\Service;
use KontragentBundle\Helper\GroundHelper;

class MeterServiceDocumentFormatter extends EntityFormatterAbstract
{
    protected $entityClass = MeterServiceDocument::class;

    /**
     * @param MeterServiceDocument $entity
     * @return array
     */
    public function getData($entity)
    {
        $rows = [];

        /** @var MeterServiceRow $row */
        foreach ($entity->getRows() as $row) {
            if ($row->isDeleted()) {
                continue;
            }

            $rows[] = [
                'id' => $row->getId(),
                'serviceId' => $row->getService()->getId(),
                'service' => $row->getService()->getName(),
                'meterId' => $row->getMeter()->getId(),
                'meter' => $row->getMeter()->getNumber(),
                'startData' => $row->getStartData(),
                'end_data' => $row->getEndData(),
                'price' => $row->getPrice(),
                'sum' => $row->getSum()
            ];
        }

        return [
            'id' => $entity->getId(),
            'created' => $entity->getCreated()->format('Y-m-d'),
            'date' => $entity->getDate()->format('Y-m-d'),
            'rows' => $rows,
            'ground' => GroundHelper::getGroundWithShortName($entity->getGround()),
            'groundId' => $entity->getGround()->getId()
        ];
    }

    /**
     * @param int $id
     * @param array $data
     * @return MeterServiceDocument|bool
     */
    public function setData($id, array $data)
    {
        /** @var MeterServiceDocument $entity */
        $entity = $this->getEntity($id, 'createMeterServiceDocument');

        if (!$entity) {
            return false;
        }

        $ids = [];
        foreach ($data['rows'] as $row) {
            if ($row['id']) {
                $subEntity = $this->entityManager->getRepository(MeterServiceRow::class)->find($row['id']);
            } else {
                $subEntity = $this->entityFactory->createMeterServiceRow();
                $subEntity->setCreated(new \DateTime());
                $subEntity->setIsDeleted(false);

                $this->entityManager->persist($subEntity);
            }

            $service = $this->entityManager->getReference(Service::class, $row['serviceId']);
            $meter = $this->entityManager->getReference(Meter::class, $row['meterId']);

            $subEntity->setMeter($meter);
            $subEntity->setService($service);
            $subEntity->setDate(new \DateTime($row['date']));
            $subEntity->setPrice($row['price']);
            $subEntity->setSum($row['sum']);
            $subEntity->setStartData($row['startData']);
            $subEntity->setEndData($row['endData']);
            $subEntity->setUpdated(new \DateTime());
            $subEntity->setDocument($entity);

            if ($subEntity->getId()) {
                $ids[] = $subEntity->getId();
            }
        }

        unset($data['rows']);
        $data['updated'] = new \DateTime();
        $data['date'] = new \DateTime($data['date']);
        $data['ground'] = $this->entityManager->getReference(Ground::class, $data['groundId']);

        if ($this->isNewEntity) {
            $data['created'] = new \DateTime();
        }

        /** @var MeterServiceRow $row */
        foreach ($entity->getRows() as $row) {
            if (!in_array($row->getId(), $ids)) {
                $row->setIsDeleted(true);
            }
        }

        $this->fillEntity($data, $entity);

        return $entity;
    }
}