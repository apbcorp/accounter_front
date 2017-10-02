<?php

namespace CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

class BaseController extends Controller
{
    /**
     * @param string[] $data
     * @param int      $code
     * @param array    $headers
     *
     * @return JsonResponse
     */
    protected function sendResponse($data, $code, $headers = [])
    {
        $response = (new JsonResponse())
            ->setEncodingOptions(JSON_UNESCAPED_UNICODE)
            ->setStatusCode($code);

        if (substr($code, 0, 1) != 2) {
            $response->setData([
                'status' => 'error',
                'result' => $data ? $data : array(),
            ]);
        } else {
            $response->setData([
                'status' => 'success',
                'result' => $data,
            ]);
        }

        return $response;
    }
}
