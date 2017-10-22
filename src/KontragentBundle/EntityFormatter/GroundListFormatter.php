<?php

namespace KontragentBundle\EntityFormatter;

use CoreBundle\BaseClasses\Interfaces\EntityInterface;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\GroundParts;
use KontragentBundle\Helper\KontragentHelper;

class GroundListFormatter
{
    protected $entityClass = Ground::class;

    /**
     * @param Ground $entity
     * @return array
     */
    public function getData($entity)
    {
        $rows = [];

        /** @var GroundParts $ground */
        foreach ($entity->getGroundParts() as $ground) {
            $rows[] = [
                'id' => $ground->getId(),
                'number' => $ground->getNumber(),
                'line' => $ground->getLine(),
                'groundNumber' => $ground->getGroundNumber()
            ];
        }

        return [
            'id' => $entity->getId(),
            'kontragentId' => $entity->getKontragent()->getId(),
            'accNumber' => $entity->getAccNumber(),
            'area' => $entity->getArea(),
            'freeArea' => $entity->getFreeArea(),
            'commonArea' => $entity->getCommonArea(),
            'allArea' => $entity->getAllArea(),
            'owner' => KontragentHelper::getFullName($entity->getKontragent()),
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
        return false;
    }
}