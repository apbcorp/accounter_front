<?php

namespace KontragentBundle\EntityFormatter;

use CoreBundle\BaseClasses\EntityFormatterAbstract;
use CoreBundle\BaseClasses\Interfaces\EntityInterface;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\GroundParts;
use KontragentBundle\Entity\Kontragent;
use KontragentBundle\Helper\KontragentHelper;

class GroundFormatter extends EntityFormatterAbstract
{
    protected $entityClass = Ground::class;

    /**
     * @param Ground $entity
     * @return array
     */
    public function getData($entity)
    {
        $result = [];
        $i = 1;

        /** @var GroundParts $ground */
        foreach ($entity->getGroundParts() as $ground) {
            $row = [
                'id' . $i => $ground->getId(),
                'number' . $i => $ground->getNumber(),
                'line' . $i => $ground->getLine(),
                'groundNumber' . $i => $ground->getGroundNumber()
            ];

            $result = array_merge($result, $row);
            $i++;
        }

        return array_merge($result, [
            'id' => $entity->getId(),
            'kontragentId' => $entity->getKontragent()->getId(),
            'kontragent' => $this->formatterFactory->getFormatter(Kontragent::class, 'list')->getData($entity->getKontragent()),
            'accNumber' => $entity->getAccNumber(),
            'area' => $entity->getArea(),
            'freeArea' => $entity->getFreeArea(),
            'commonArea' => $entity->getCommonArea(),
            'allArea' => $entity->getAllArea(),
            'owner' => KontragentHelper::getFullName($entity->getKontragent())
        ]);
    }

    /**
     * @param int $id
     * @param array $data
     * @return EntityInterface|bool
     */
    public function setData($id, array $data)
    {
        $entity = $this->getEntity($id, 'createGround');

        if (!$entity) {
            return false;
        }

        foreach ($data['rows'] as $row) {
            if (!$row['id'] && !$row['number'] && !$row['line'] && !$row['groundNumber']) {
                continue;
            }

            if (!$row['id']) {
                $groundPart = $this->entityFactory->createGroundPart();
                $this->entityManager->persist($groundPart);
            } else {
                $groundPart = $this->entityManager->getRepository(GroundParts::class)->find($row['id']);

                if (!$groundPart) {
                    $groundPart = $this->entityFactory->createGroundPart();
                    $this->entityManager->persist($groundPart);
                }
            }

            if (!$row['number'] && !$row['line'] && !$row['groundNumber']) {
                $this->entityManager->remove($groundPart);
                
                continue;
            }

            $groundPart->setNumber($row['number']);
            $groundPart->setLine($row['line']);
            $groundPart->setGroundNumber($row['groundNumber']);
            $groundPart->setGround($entity);
            $groundPart->setIsDeleted(false);
        }

        unset($data['rows']);
        if (isset($data['kontragentId'])) {
            $data['kontragent'] = $this->entityManager->getReference(Kontragent::class, $data['kontragentId']);
            unset($data['kontragentId']);
        }

        $this->fillEntity($data, $entity);

        return $entity;
    }
}