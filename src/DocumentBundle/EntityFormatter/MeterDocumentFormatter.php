<?php

namespace DocumentBundle\EntityFormatter;

use CoreBundle\BaseClasses\EntityFormatterAbstract;
use CoreBundle\BaseClasses\Interfaces\EntityInterface;
use DocumentBundle\Entity\MeterDocument;
use DocumentBundle\Entity\MeterRow;
use KontragentBundle\Entity\Meter;

class MeterDocumentFormatter extends EntityFormatterAbstract
{
    protected $entityClass = MeterDocument::class;

    /**
     * @param MeterDocument $entity
     * @return array
     */
    public function getData($entity)
    {
        $rows = [];

        /** @var MeterRow $row */
        foreach ($entity->getRows() as $row) {
            if ($row->isDeleted()) {
                continue;
            }

            $kontragent = $row->getMeter()->getGround()->getKontragent();

            $rows[] = [
                'id' => $row->getId(),
                'meterId' => $row->getMeter()->getId(),
                'meter' => '№ ' . $row->getMeter()->getNumber() . ' собственник ' . implode(' ', [$kontragent->getSurname(), $kontragent->getName(), $kontragent->getName2()]),
                'startValue' => $row->getStartValue(),
                'endValue' => $row->getEndValue()
            ];
        }

        return [
            'id' => $entity->getId(),
            'created' => $entity->getCreated()->format('Y-m-d'),
            'date' => $entity->getDate()->format('Y-m-d'),
            'rows' => $rows
        ];
    }

    /**
     * @param int $id
     * @param array $data
     * @return EntityInterface|bool
     */
    public function setData($id, array $data)
    {
        /** @var MeterDocument $entity */
        $entity = $this->getEntity($id, 'createMeterDocument');

        if (!$entity) {
            return false;
        }

        $ids = [];
        foreach ($data['rows'] as $row) {
            if ($row['id']) {
                $subEntity = $this->entityManager->getRepository(MeterRow::class)->find($row['id']);
            } else {
                $subEntity = $this->entityFactory->createMeterRow();
                $subEntity->setCreated(new \DateTime());
                $subEntity->setIsDeleted(false);

                $this->entityManager->persist($subEntity);
            }

            $meter = $this->entityManager->getReference(Meter::class, $row['meterId']);

            $subEntity->setMeter($meter);
            $subEntity->setStartValue($row['startValue']);
            $subEntity->setEndValue($row['endValue']);
            $subEntity->setUpdated(new \DateTime());
            $subEntity->setDocument($entity);

            if ($subEntity->getId()) {
                $ids[] = $subEntity->getId();
            }
        }

        unset($data['rows']);
        $data['updated'] = new \DateTime();
        $data['date'] = new \DateTime($data['date']);

        if ($this->isNewEntity) {
            $data['created'] = new \DateTime();
        }

        /** @var MeterRow $row */
        foreach ($entity->getRows() as $row) {
            if (!in_array($row->getId(), $ids)) {
                $row->setIsDeleted(true);
            }
        }

        $this->fillEntity($data, $entity);

        return $entity;
    }
}