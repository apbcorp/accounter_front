<?php

namespace KontragentBundle\EntityFormatter;

use CoreBundle\BaseClasses\EntityFormatterAbstract;
use CoreBundle\BaseClasses\Interfaces\EntityInterface;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\Meter;
use KontragentBundle\Helper\KontragentHelper;

class MeterFormatter extends EntityFormatterAbstract
{
    protected $entityClass = Meter::class;

    /**
     * @param Meter $entity
     * @return array
     */
    public function getData($entity)
    {
        return [
            'id' => $entity->getId(),
            'groundId' => $entity->getGround()->getId(),
            'ground' => 'Л/с ' . $entity->getGround()->getAccNumber() . ' (' . KontragentHelper::getShortName($entity->getGround()->getKontragent()) . ')',
            'number' => $entity->getNumber(),
            'type' => $entity->getType()
        ];
    }

    /**
     * @param int $id
     * @param array $data
     * @return EntityInterface|bool
     */
    public function setData($id, array $data)
    {
        $entity = $this->getEntity($id, 'createMeter');

        if (!$entity) {
            return false;
        }
        
        if (isset($data['groundId'])) {
            $data['ground'] = $this->entityManager->getReference(Ground::class, $data['groundId']);
            unset($data['groundId']);
        }

        $this->fillEntity($data, $entity);

        return $entity;
    }
}