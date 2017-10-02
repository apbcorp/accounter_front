<?php

namespace CoreBundle\Container;

use Symfony\Component\HttpFoundation\Cookie;

class CookieContainer
{
    /**
     * @var Cookie[]
     */
    private $cookies = [];

    /**
     * @param string $name
     * @param mixed  $value
     * @param int    $expire
     */
    public function add($name, $value, $expire = 0)
    {
        $this->cookies[$name] = new Cookie($name, $value, $expire);
    }

    /**
     * @param string $key
     * @return null|Cookie
     */
    public function get($key)
    {
        if (isset($this->cookies[$key])) {
            return $this->cookies[$key];
        }

        return null;
    }

    /**
     * @return Cookie[]
     */
    public function getAll()
    {
        return $this->cookies;
    }

    /**
     *
     */
    public function clear()
    {
        $this->cookies = [];
    }
} 