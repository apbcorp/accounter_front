<?php

namespace CoreBundle\Struct;

use Symfony\Component\HttpFoundation\Request;

class FilterStruct
{
    const DEFAULT_LIMIT = 25;

    /**
     * @var array
     */
    private $filters;

    /**
     * @var array
     */
    private $order;

    /**
     * @var int
     */
    private $limit;

    /**
     * @var int
     */
    private $offset;

    /**
     * @param Request $request
     */
    public function parse(Request $request)
    {
        $this->filters = $request->get('filter') ? : [];
        $orderBy = $request->get('order_by') ? : 'id';
        $orderDesc = $request->get('order_type') ? : 'asc';
        $this->order = [$orderBy => $orderDesc];
        $this->limit = $request->get('limit') ? : self::DEFAULT_LIMIT;
        $page = $request->get('page') ? : 1;
        $this->offset = ($page - 1) * $this->limit;

        $this->filters['deleted'] = 0;
    }

    /**
     * @return array
     */
    public function getOrder()
    {
        return $this->order;
    }

    /**
     * @return array
     */
    public function getFilter()
    {
        return $this->filters;
    }

    /**
     * @return int
     */
    public function getLimit()
    {
        return $this->limit;
    }

    /**
     * @return int
     */
    public function getOffset()
    {
        return $this->offset;
    }
}