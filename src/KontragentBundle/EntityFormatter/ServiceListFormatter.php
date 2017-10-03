<?php

namespace KontragentBundle\EntityFormatter;

use CoreBundle\BaseClasses\EntityFormatterAbstract;
use CoreBundle\BaseClasses\Interfaces\EntityInterface;
use CoreBundle\Dictionary\ServiceTypeDictionary;
use KontragentBundle\Entity\Service;

class ServiceListFormatter extends EntityFormatterAbstract
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
            'type' => ServiceTypeDictionary::TYPE_LANGS[$entity->getType()],
            'subtype' => ServiceTypeDictionary::SUBTYPE_LANGS[$entity->getSubType()]
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