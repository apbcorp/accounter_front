<?php

namespace KontragentBundle\EntityFormatter;

use CoreBundle\BaseClasses\EntityFormatterAbstract;
use CoreBundle\BaseClasses\Interfaces\EntityInterface;
use CoreBundle\Dictionary\MetricTypeDictionary;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\Meter;

class MeterListFormatter extends EntityFormatterAbstract
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
            'ground' => 'Л/с ' . $entity->getGround()->getAccNumber() . ' (' . implode(' ',[
                    $entity->getGround()->getKontragent()->getSurname(),
                    mb_substr($entity->getGround()->getKontragent()->getName(), 0, 1) . '.',
                    mb_substr($entity->getGround()->getKontragent()->getName2(), 0, 1) . '.'
                ]) . ')',
            'number' => $entity->getNumber(),
            'type' => MetricTypeDictionary::LANGS[$entity->getType()]
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