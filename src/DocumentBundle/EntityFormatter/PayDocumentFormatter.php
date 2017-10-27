<?php

namespace DocumentBundle\EntityFormatter;

use CoreBundle\BaseClasses\EntityFormatterAbstract;
use CoreBundle\BaseClasses\Interfaces\EntityInterface;
use DocumentBundle\Entity\PayDocument;
use DocumentBundle\Entity\PayRow;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\Kontragent;
use KontragentBundle\Entity\Service;
use KontragentBundle\Helper\KontragentHelper;

class PayDocumentFormatter extends EntityFormatterAbstract
{
    protected $entityClass = PayDocument::class;

    /**
     * @param PayDocument $entity
     * @return array
     */
    public function getData($entity)
    {
        $rows = [];

        /** @var PayRow $row */
        foreach ($entity->getRows() as $row) {
            if ($row->isDeleted()) {
                continue;
            }

            $rows[] = [
                'id' => $row->getId(),
                'serviceId' => $row->getService()->getId(),
                'service' => $row->getService()->getName(),
                'ground' => $row->getGround()->getId() ? $row->getGround()->getAccNumber() : null,
                'groundId' => $row->getGround()->getId() ? $row->getGround()->getId() : null,
                'sum' => $row->getSum()
            ];
        }

        return [
            'id' => $entity->getId(),
            'date' => $entity->getDate()->format('Y-m-d'),
            'kontragent' => KontragentHelper::getShortName($entity->getKontragent()),
            'kontragentId' => $entity->getKontragent()->getId(),
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
        /** @var PayDocument $entity */
        $entity = $this->getEntity($id, 'createPayDocument');

        if (!$entity) {
            return false;
        }

        $ids = [];
        foreach ($data['rows'] as $row) {
            if ($row['id']) {
                $subEntity = $this->entityManager->getRepository(PayRow::class)->find($row['id']);
            } else {
                $subEntity = $this->entityFactory->createPayRow();
                $subEntity->setCreated(new \DateTime());
                $subEntity->setIsDeleted(false);

                $this->entityManager->persist($subEntity);
            }

            $service = $this->entityManager->getReference(Service::class, $row['serviceId']);
            $ground = $this->entityManager->getReference(Ground::class, $row['groundId']);

            $subEntity->setService($service);
            $subEntity->setGround($ground);
            $subEntity->setSum($row['sum']);
            $subEntity->setUpdated(new \DateTime());
            $subEntity->setDocument($entity);

            if ($subEntity->getId()) {
                $ids[] = $subEntity->getId();
            }
        }

        unset($data['rows']);
        $data['kontragent'] = $this->entityManager->getReference(Kontragent::class, $data['kontragentId']);
        $data['date'] = new \DateTime($data['date']);
        $data['updated'] = new \DateTime();

        if ($this->isNewEntity) {
            $data['created'] = new \DateTime();
        }

        /** @var PayRow $row */
        foreach ($entity->getRows() as $row) {
            if (!in_array($row->getId(), $ids)) {
                $row->setIsDeleted(true);
            }
        }

        $this->fillEntity($data, $entity);

        return $entity;
    }
}