<?php

namespace KontragentBundle\EntityFormatter;

use CoreBundle\BaseClasses\EntityFormatterAbstract;
use CoreBundle\BaseClasses\Interfaces\EntityInterface;
use KontragentBundle\Entity\Service;

class ServiceFormatter extends EntityFormatterAbstract
{
    protected $entityClass = Service::class;

    /**
     * @param Service $entity
     * @return array
     */
    public function getData($entity)
    {
        return [
            'id' => $entity->getId(),
            'name' => $entity->getName(),
            'type' => $entity->getType(),
            'subtype' => $entity->getSubType(),
            'periodType' => $entity->getPeriodType()
        ];
    }

    /**
     * @param int $id
     * @param array $data
     * @return EntityInterface|bool
     */
    public function setData($id, array $data)
    {
        $entity = $this->getEntity($id, 'createService');

        if (!$entity) {
            return false;
        }

        $this->fillEntity($data, $entity);

        return $entity;
    }
}