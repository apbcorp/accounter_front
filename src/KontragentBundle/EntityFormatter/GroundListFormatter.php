<?php

namespace KontragentBundle\EntityFormatter;

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
     */
    public function setData($id, array $data)
    {

    }
}