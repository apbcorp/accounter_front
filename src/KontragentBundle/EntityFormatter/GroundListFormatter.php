<?php

namespace KontragentBundle\EntityFormatter;

use CoreBundle\BaseClasses\Interfaces\EntityInterface;
use KontragentBundle\Entity\Ground;

class GroundListFormatter
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
            'accNumber' => $entity->getAccNumber(),
            'number' => $entity->getNumber(),
            'line' => $entity->getLine(),
            'groundNumber' => $entity->getGroundNumber(),
            'area' => $entity->getArea(),
            'freeArea' => $entity->getFreeArea(),
            'commonArea' => $entity->getCommonArea(),
            'allArea' => $entity->getAllArea(),
            'owner' => implode(' ', [
                $entity->getKontragent()->getSurname(),
                $entity->getKontragent()->getName(),
                $entity->getKontragent()->getName2(),
            ])
        ];
    }

    /**
     * @param int $id
     * @param array $data
     * @return EntityInterface|bool
     */
    public function setData($id, array $data)
    {
        return false;
    }
}