<?php

namespace KontragentBundle\EntityFormatter;

use CoreBundle\BaseClasses\EntityFormatterAbstract;
use CoreBundle\BaseClasses\Interfaces\EntityInterface;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\Kontragent;

class GroundFormatter extends EntityFormatterAbstract
{
    protected $entityClass = Ground::class;

    /**
     * @param Ground $entity
     * @return array
     */
    public function getData($entity)
    {
        return [
            'id' => $entity->getId(),
            'kontragentId' => $entity->getKontragent()->getId(),
            'kontragent' => $this->formatterFactory->getFormatter(Kontragent::class, 'list')->getData($entity->getKontragent()),
            'accNumber' => $entity->getAccNumber(),
            'number' => $entity->getNumber(),
            'line' => $entity->getLine(),
            'groundNumber' => $entity->getGroundNumber(),
            'area' => $entity->getArea(),
            'freeArea' => $entity->getFreeArea(),
            'commonArea' => $entity->getCommonArea(),
            'allArea' => $entity->getAllArea()
        ];
    }

    /**
     * @param int $id
     * @param array $data
     * @return EntityInterface|false
     */
    public function setData($id, array $data)
    {
        $entity = $this->getEntity($id, 'createGround');

        if (!$entity) {
            return false;
        }

        $this->fillEntity($data, $entity);

        return $entity;
    }
}