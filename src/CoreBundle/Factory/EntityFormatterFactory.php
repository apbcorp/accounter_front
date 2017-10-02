<?php

namespace CoreBundle\Factory;

use CoreBundle\BaseClasses\EntityFormatterAbstract;
use Doctrine\ORM\EntityManager;

class EntityFormatterFactory
{
    /**
     * @var EntityManager
     */
    private $entityManager;

    /**
     * @var EntityFactory
     */
    protected $entityFactory;

    private $formatters = [];

    public function __construct(EntityFactory $entityFactory, EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
        $this->entityFactory = $entityFactory;
    }

    /**
     * @param string $entityClass
     * @param string $type
     * @return EntityFormatterAbstract
     */
    public function getFormatter($entityClass, $type = '')
    {
        $parts = explode('\\', $entityClass);
        $parts[count($parts) - 2] = 'EntityFormatter';
        $parts[count($parts) - 1] .= $type . 'Formatter';

        $className = implode('\\', $parts);

        if (!isset($this->formatters[$className])) {
            $this->formatters[$className] = new $className($this->entityFactory, $this, $this->entityManager);
        }

        return $this->formatters[$className];
    }
}